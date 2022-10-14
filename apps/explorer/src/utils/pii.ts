export const obscureEmail = (email: string) => {
  const [name, domain] = email.split("@");
  return `${name[0]}${new Array(name.length).join("*")}@${domain}`;
};
