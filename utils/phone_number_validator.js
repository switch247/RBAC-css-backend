// function validatePhoneNumber(phone_number) {
//   if (!phone_number || phone_number=="" ){
//     return true;
//   }
//   if (typeof phone_number !== 'string' || !phone_number.startsWith('+251') || phone_number.length !== 13) {
//     return false;
//   }

//   for (let i = 4; i < phone_number.length; i++) {
//     if (!isNaN(phone_number[i]) && !/\s/.test(phone_number[i])) {
//       continue;
//     } else {
//       return false;
//     }
//   }

//   return true;
// }

function formatAndValidatePhoneNumber(phoneNumber) {
  try {
    if (phoneNumber == null || phoneNumber == '') {
      return undefined;
    }

    // Trim whitespace from the input
    phoneNumber = phoneNumber.trim();

    // Check if the phone number length is either 10 or 13
    if (phoneNumber.length === 13) {
      // Check if it follows the format "+251" followed by 9 digits
      const regex = /^\+251\d{9}$/;
      if (regex.test(phoneNumber)) {
        return phoneNumber; // Already valid 13-digit format
      } else {
        return {
          error:
            "Invalid phone number format for 13 digits. It should be in the format '+251XXXXXXXXX'.",
        };
      }
    } else if (phoneNumber.length === 10) {
      // Check if it starts with "0" and contains only digits
      const regex = /^0\d{9}$/;
      if (regex.test(phoneNumber)) {
        // If valid, replace "0" with "+251" to make it a 13-digit number
        return phoneNumber.replace('0', '+251');
      } else {
        return {
          error:
            "Invalid phone number format for 10 digits. It should start with '0' and be followed by 9 digits.",
        };
      }
    } else if (phoneNumber.length === 9) {
      // Check if it contains only digits
      const regex = /^\d{9}$/;
      if (regex.test(phoneNumber)) {
        // If valid, add "+251" to make it a 13-digit number
        return '+251' + phoneNumber;
      } else {
        return {
          error:
            'Invalid phone number format for 9 digits. It should contain only 9 digits.',
        };
      }
    } else {
      return { error: 'Phone number must be either 9, 10 or 13 digits long.' };
    }
  } catch (err) {
    // Log any unexpected errors (for debugging purposes)
    console.error('Error while validating phone number:', err);
    return {
      error: 'An unexpected error occurred while validating the phone number.',
    };
  }
}

module.exports = formatAndValidatePhoneNumber;
