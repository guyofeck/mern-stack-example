export function validateRecord(record) {
  const errors = {};
  if (typeof record?.name !== "string" || !record.name.trim()) {
    errors.name = "Name is required.";
  }
  if (typeof record?.position !== "string" || record.position.trim().length < 2) {
    errors.position = "Position must be at least 2 characters.";
  }
  if (!["Intern", "Junior", "Senior"].includes(record?.level)) {
    errors.level = "Level must be one of Intern, Junior or Senior.";
  }
  return errors;
}
