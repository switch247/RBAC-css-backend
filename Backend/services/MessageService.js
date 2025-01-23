const axios = require('axios');
require('dotenv').config(); // Load environment variables from a .env file

class MessageService {
  static baseURL = 'https://api.afromessage.com/api/send';
  static bulkURL = 'https://api.afromessage.com/api/send-bulk';

  static token = process.env.AFRO_MESSAGE_KEY;
  static identifierID = process.env.AFRO_MESSAGE_ID;
  static IdentifierName = process.env.AFRO_MESSAGE_NAME;
  static headers = {
    Authorization: `Bearer ${this.token}`,
  };
  // sending single sms
  static async sendSingleMessage(data) {
    try {
      console.log('sending message');
      const message = data.message;
      const phoneNumber = data.phone_number;
      console.log(phoneNumber, message);
      const response = await axios.post(
        this.baseURL,
        {
          to: phoneNumber,
          message: message,
          sender: this.IdentifierName,
          api_key: this.token,
          from: this.identifierID,
        },
        { headers: this.headers }
      );
      if (response.data.acknowledge == 'error')
        throw new Error(response.data.errors);
      console.log(response.data);
      // console.log(response);
      return response;
    } catch (error) {
      throw error;
      console.error(error);
    }
  }

  // bulk message
  static async sendBulkMessages(payload) {
    try {
      const response = await axios.post(this.bulkURL, payload, {
        headers: this.headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  /* Fixed sendOtp function */
  static async sendOtp(phoneNumber) {
    // Use AfroMessage API to send a security code challenge
    const response = await axios.get(
      'https://api.afromessage.com/api/challenge',
      {
        params: {
          sender: this.IdentifierName,
          from: this.identifierID,
          to: phoneNumber,
          len: 6, // Set code length to 6 digits
          t: 0, // Code type: 0 for numbers only
          ttl: 60 * 5, // Time to live: 300 seconds
          sb: 1,
          pr: 'Your OTP Is',
          sa: 1,
          ps: 'Valid For 5 Minutes',
        },
        headers: this.headers,
      }
    );
    console.log(response.data);

    if (response.data.acknowledge != 'success') {
      throw new Error('Failed to send OTP');
    }

    // Extract verification ID from the response
    const verificationId = response.data.response.verificationId;
    const otp = response.data.response.code;

    // Return an object containing verification ID for later use
    return { otp, verificationId };
  }

  /* Fixed verifyOtp function */
  static async verifyOtp(phoneNumber, otp, verificationId) {
    // Use AfroMessage API to verify the code
    const response = await axios.get('https://api.afromessage.com/api/verify', {
      params: {
        to: phoneNumber,
        code: otp,
        vc: verificationId, // Use verification ID from sendOtp
      },
      headers: this.headers,
    });
    console.log(response.data);

    if (response.data.acknowledge != 'success') {
      return false;
      // throw new Error('Failed to send OTP');
    }
    return true;
    // return response.data.acknowledge === 'success';
  }
}

module.exports = MessageService;
