export const getErrorMessageByPropertyName = (
  obj: Record<string, any>,
  propertyPath: string
) => {
  //let obj = errors
  // let propertyPath = admin.name.firstName
  //['admin', 'name', 'firstName']
  const properties = propertyPath.split(".");
  let value = obj;

  for (let property of properties) {
    if (value[property]) {
      value = value[property];
    } else {
      return undefined;
    }
  }

  return value.message;
};
