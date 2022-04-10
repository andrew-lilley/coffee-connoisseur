import { useState } from 'react';
import { useStoreContext } from '../store/store-context';
import { StoreActionTypes, GeoLocationPosition } from '../types/coffeeStore';

const useTrackLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState('');
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  const { setCoffeeStoresData } = useStoreContext();

  const success = (position: GeoLocationPosition) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    setCoffeeStoresData({
      type: StoreActionTypes.SET_LAT_LONG,
      payload: `${latitude},${longitude}`,
    });
    setLocationErrorMsg('');
    setIsFindingLocation(false);
  };

  const error = () => {
    setIsFindingLocation(false);
    setLocationErrorMsg('Unable to retrieve your location');
  };

  const handleTrackLocation = () => {
    setIsFindingLocation(true);

    if (!navigator.geolocation) {
      setLocationErrorMsg('Geolocation is not supported by your browser');
      setIsFindingLocation(false);
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    handleTrackLocation,
    locationErrorMsg,
    isFindingLocation,
  };
};

export default useTrackLocation;
