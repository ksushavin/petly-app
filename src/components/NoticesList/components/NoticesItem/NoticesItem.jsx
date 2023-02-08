import PropTypes from 'prop-types';
import { useScreen } from 'hooks';
import { getStringAge } from './utilities/getStringAge';
import { STANDART_ANIMATION_VARIANT } from 'constants/animationVariants';
import { PUBLIC_CATEGORIES } from 'constants/noticesCategory';
import { CURRENCY_FORMAT } from 'constants/currencyFormat';
import { BottomButtons, FavoriteButton } from './components';
import { NoticeContainer, NoticeStats, NoticeTitle } from './NoticesItemStyled';
import { NoticeAvatar } from 'components/Shared';

export const NoticesItem = ({ noticeData }) => {
  const screen = useScreen();

  const {
    _id,
    title,
    name,
    breed,
    location,
    price,
    birthdate,
    category,
    avatarURL,
    owner: { _id: ownerId },
  } = noticeData;

  const stringAge = getStringAge(birthdate);
  const categoryName = PUBLIC_CATEGORIES.find(
    element => element.category === category
  ).name;

  return (
    <NoticeContainer
      key={_id}
      variants={STANDART_ANIMATION_VARIANT}
      initial="initial"
      animate="animate"
      exit="exit"
      layout
    >
      <FavoriteButton noticeId={_id} />

      <NoticeAvatar
        avatarURL={avatarURL}
        name={name}
        categoryName={categoryName}
      />

      <NoticeTitle isMobile={screen === 'mobile'}>
        {title.charAt(0).toUpperCase() + title.slice(1)}
      </NoticeTitle>

      <NoticeStats>
        <span>Breed:</span>
        <span>{breed.charAt(0).toUpperCase() + breed.slice(1)}</span>
        <span>Location:</span>
        <span>{location.charAt(0).toUpperCase() + location.slice(1)}</span>
        <span>Age:</span>
        <span>{stringAge.charAt(0).toUpperCase() + stringAge.slice(1)}</span>
        {price ? (
          <>
            <span>Price:</span>
            <span>{CURRENCY_FORMAT.format(price)}</span>
          </>
        ) : null}
      </NoticeStats>

      <BottomButtons noticeId={_id} ownerId={ownerId} petName={name} />
    </NoticeContainer>
  );
};

NoticesItem.propTypes = {
  noticeData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    breed: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    birthdate: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    avatarURL: PropTypes.string.isRequired,
  }).isRequired,
};
