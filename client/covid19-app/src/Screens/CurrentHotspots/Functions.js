export const filterHotspots = (e, setHotspots, hotspotsLength, hotspotsFilter) => {
    let currentValue = e.target.value;
    const valLength = currentValue.length;

    const updateState = hotspotsFilter.filter(hotspot => {
        const postCode = hotspot.postCode;
        const postCodeSub = postCode.substring(0, valLength);
        return postCodeSub === currentValue;
    });

    if(updateState.length !== hotspotsLength) setHotspots(updateState);
}