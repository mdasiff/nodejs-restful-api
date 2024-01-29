function required(attribute) {
    return attribute + ' is required';
}
function number_only(attribute) {
    return attribute + ' must be a number';
}
function valid(attribute) {
    return 'Please enter a valid '+attribute;
}
function min(attribute, min) {
    return attribute+' must be at least '+min+' characters long.';
}
function upload_valid(attribute) {
    return 'Please upload a valid '+attribute;
}

export {
    required,
    valid,
    min,
    upload_valid,
    number_only
}