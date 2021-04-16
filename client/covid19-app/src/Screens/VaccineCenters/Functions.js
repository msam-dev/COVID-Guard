export const filterCenters = (e, setCenter, centerLength, centerFilter) => {
    let currentValue = e.target.value;
    const valLength = currentValue.length;

    const updateState = centerFilter.filter(c => {
        const postCode = c.postCode;
        const postCodeSub = postCode.substring(0, valLength);
        return postCodeSub === currentValue;
    });

    if(updateState.length !== centerLength) setCenter(updateState);
}