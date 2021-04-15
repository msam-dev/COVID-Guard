export const filterHotspots = (e, setHotspots, hotspotsFilter) => {
    let currentValue = e.target.value;
   
    const updateState = hotspotsFilter.filter(hotspot => {
        const valLength = currentValue.length;
        const postCode = hotspot.postCode;
        const postCodeSub = postCode.substring(0, valLength);
        return postCodeSub === currentValue;
    });

   setHotspots(updateState);
}