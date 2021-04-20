export const setCustLayout = () => {
    return {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
          span: 9,
        },
    };
}

export const handleSubmitBusiness = form => {
    form.validateFields()
    .then(res => {
        console.log(res);
    })
    .catch(err => {
        console.log(err);
    })
}