import PropTypes from 'prop-types';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  useGetCurrentInfoQuery,
  useUpdateCurrentInfoMutation,
} from 'redux/currentUserInfo/currentUserInfoApi';
import { AnimatePresence, motion } from 'framer-motion';
import InputMask from 'react-input-mask';
import * as yup from 'yup';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/uk';
import { Autocomplete, createFilterOptions } from '@mui/material';
import { makeToast } from 'utilities/makeToast';
import { userDataValidationSchema } from 'utilities/validationSchemas';
import { standartAnimation } from 'constants/animationVariants';
import { CITIES } from 'constants/cities';
import {
  DateInputWrapper,
  EditIcon,
  ParameterButton,
  ParameterInput,
  ParameterLabel,
  SaveIcon,
} from './EditParameterUnitStyled';

const filterOptions = createFilterOptions({
  matchFrom: 'start',
  trim: true,
});

export const EditParameterUnit = ({
  unitSettings,
  activeUnit,
  setActiveUnit,
  currentData,
}) => {
  const [parameterValue, setParameterValue] = useState('');
  const [isFieldEditing, setIsFieldEditing] = useState(false);
  const currentField = useRef(null);
  const {
    label: unitLabel,
    name: unitName,
    type: unitType,
    fieldVariant: unitFieldVariant,
  } = unitSettings;

  const { isLoading } = useGetCurrentInfoQuery();
  const [updateInfo, { error, isLoading: isUpdating }] =
    useUpdateCurrentInfoMutation();

  const currentUnitData = currentData ? currentData[unitName] : null;

  const onValueChange = ({ currentTarget }) =>
    setParameterValue(currentTarget.value);

  const onParameterButtonClick = useCallback(async () => {
    if (activeUnit !== unitName) {
      setActiveUnit(unitName);

      setTimeout(
        () => currentField.current && currentField.current.focus(),
        100
      );
      return;
    }

    const trimmedParameterValue = parameterValue.trim();

    if (currentUnitData !== trimmedParameterValue) {
      try {
        await yup
          .reach(userDataValidationSchema, unitName)
          .validate(trimmedParameterValue);
      } catch ({ errors }) {
        makeToast(errors[0]);

        return;
      }

      updateInfo({ [unitName]: trimmedParameterValue });
    }
    setActiveUnit(null);
  }, [
    activeUnit,
    currentUnitData,
    parameterValue,
    setActiveUnit,
    unitName,
    updateInfo,
  ]);

  const onEnterKeyDown = useCallback(
    ({ key }) => {
      if (key !== 'Enter') return;

      onParameterButtonClick({ currentTarget: { value: '' } });
    },
    [onParameterButtonClick]
  );

  useEffect(() => {
    if (isFieldEditing) document.addEventListener('keydown', onEnterKeyDown);

    if (!isFieldEditing)
      document.removeEventListener('keydown', onEnterKeyDown);

    return () => document.removeEventListener('keydown', onEnterKeyDown);
  }, [isFieldEditing, onEnterKeyDown]);

  useEffect(() => {
    if (!error) return;

    makeToast(error?.data?.code);
  }, [error]);

  useEffect(() => {
    if (!currentUnitData) return;

    setParameterValue(currentUnitData);
  }, [currentUnitData, unitName]);

  return (
    <>
      <ParameterLabel htmlFor={unitName}>{`${unitLabel}:`}</ParameterLabel>
      {unitFieldVariant === 'datePicker' ? (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="uk">
          <DatePicker
            value={parameterValue}
            onChange={value =>
              onValueChange({ currentTarget: { value: value.toString() } })
            }
            renderInput={({ inputRef, inputProps, InputProps }) => (
              <DateInputWrapper>
                <ParameterInput
                  ref={inputRef}
                  {...inputProps}
                  id={unitName}
                  type={unitType}
                  readOnly={true}
                  placeholder={null}
                  disabled={activeUnit !== unitName}
                />
                <AnimatePresence>
                  {activeUnit === unitName ? (
                    <motion.div
                      key="datePicker"
                      variants={standartAnimation}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      {InputProps?.endAdornment}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </DateInputWrapper>
            )}
          />
        </LocalizationProvider>
      ) : null}

      {unitFieldVariant === 'mask' ? (
        <ParameterInput
          as={InputMask}
          ref={currentField}
          mask="+38 (999) 999-99-99"
          maskPlaceholder={null}
          id={unitName}
          value={parameterValue}
          type={unitType}
          disabled={activeUnit !== unitName}
          onFocus={() => setIsFieldEditing(true)}
          onBlur={() => setIsFieldEditing(false)}
          onChange={onValueChange}
        />
      ) : null}

      {unitFieldVariant === 'autocomplete' ? (
        <Autocomplete
          id={unitName}
          disablePortal={false}
          selectOnFocus={false}
          autoComplete={true}
          autoHighlight={true}
          noOptionsText="No city was found"
          openText="Open city list"
          clearText="Clear"
          value={parameterValue || null}
          filterOptions={filterOptions}
          options={CITIES}
          isOptionEqualToValue={(option, value) => option === value}
          onChange={(_, value) => onValueChange({ currentTarget: { value } })}
          renderInput={({ InputProps, inputProps }) => (
            <div ref={InputProps.ref}>
              <ParameterInput
                {...inputProps}
                onFocus={() => setIsFieldEditing(true)}
                onBlur={() => setIsFieldEditing(false)}
                type={unitType}
                disabled={activeUnit !== unitName}
              />
            </div>
          )}
        />
      ) : null}

      {unitFieldVariant === 'common' ? (
        <ParameterInput
          id={unitName}
          type={unitType}
          value={parameterValue}
          disabled={activeUnit !== unitName}
          ref={currentField}
          onFocus={() => setIsFieldEditing(true)}
          onBlur={() => setIsFieldEditing(false)}
          onChange={onValueChange}
        />
      ) : null}

      <ParameterButton
        title={
          activeUnit === unitName ? `Save ${unitName}` : `Edit ${unitName}`
        }
        aria-label={
          activeUnit === unitName ? `Save ${unitName}` : `Edit ${unitName}`
        }
        type="button"
        loading={isLoading || isUpdating}
        disabled={activeUnit && activeUnit !== unitName}
        onClick={onParameterButtonClick}
      >
        <AnimatePresence mode="wait">
          {activeUnit !== unitName && !isLoading && !isUpdating ? (
            <motion.div
              key="editIcon"
              variants={standartAnimation}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <EditIcon />
            </motion.div>
          ) : null}

          {activeUnit === unitName && !isLoading && !isUpdating ? (
            <motion.div
              key="saveIcon"
              variants={standartAnimation}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <SaveIcon />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </ParameterButton>
    </>
  );
};

EditParameterUnit.propTypes = {
  unitSettings: PropTypes.exact({
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    fieldVariant: PropTypes.string.isRequired,
  }).isRequired,
  activeUnit: PropTypes.string,
  setActiveUnit: PropTypes.func.isRequired,
  currentData: PropTypes.object,
};