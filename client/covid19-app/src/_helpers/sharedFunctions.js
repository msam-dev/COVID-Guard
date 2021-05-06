//Event handler that only allows numbers as input
export const onlyNumbers = (e, form, field, index, subfield) => {
    const reg = /^[0-9]*$/;
    const str = e.target.value;
    let field_obj = {};

    if(typeof index !== 'undefined'){
        let arr = form.getFieldValue(field);
        let sub_obj = arr[index];
        
        if (str === '' || reg.test(str)) sub_obj[subfield] = str;  
        else sub_obj[subfield] = makeNumber(str);
        field_obj[field] = arr;    
    }

    else{
        if (str === '' || reg.test(str)) field_obj[field] = str;     
        else field_obj[field] = makeNumber(str); 
    }
    form.setFieldsValue(field_obj);
}

//Removes characters that are not numbers from a string
export const makeNumber = str => {
    for(let i = 0; i < str.length; i++){
        if(isNaN(str[i]) || str[i]===" "){
            str = str.substring(0, i) + str.substring(i+1, str.length);
            i--;
        }
    }
    return str;
}

export const isWhiteSpace = s => {
    for(let i = 0; i < s.length; i++) if(s[i] !== ' ') return false;
    return true;
}

export const validateEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export const nth = d => {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
    }
}