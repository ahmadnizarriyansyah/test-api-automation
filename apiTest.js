const axios = require('axios');
const { expect } = require('chai');
const fs = require('fs');
require('dotenv').config();

const BASE_URL = 'https://restful-booker.herokuapp.com';
let token = '';
let bookingId = '';
let bookingData = JSON.parse(fs.readFileSync('bookingData.json', 'utf8'));

describe('Restful Booker API Automation Testing', function() {
  this.timeout(10000); 

  it('should authenticate and get token', async () => {
    const res = await axios.post(`${BASE_URL}/auth`, {
      username: 'admin',
      password: 'password123',
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(res.status).to.equal(200);
    expect(res.data).to.have.property('token');
    token = res.data.token;
    console.log('Token:', token);
  });

  it('should create a new booking', async () => {
    const res = await axios.post(`${BASE_URL}/booking`, bookingData, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    expect(res.status).to.equal(200);
    expect(res.data).to.have.property('bookingid');
    expect(res.data).to.have.property('booking');
    bookingId = res.data.bookingid;
    console.log('Booking ID:', bookingId);
  });

  it('should get the created booking', async () => {
    const res = await axios.get(`${BASE_URL}/booking/${bookingId}`, {
      headers: {
        'Accept': 'application/json'
      }
    });

    expect(res.status).to.equal(200);
    expect(res.data.firstname).to.equal(bookingData.firstname);
    expect(res.data.lastname).to.equal(bookingData.lastname);
    expect(res.data.totalprice).to.equal(bookingData.totalprice);
    expect(res.data.depositpaid).to.equal(bookingData.depositpaid);
    expect(res.data.bookingdates.checkin).to.equal(bookingData.bookingdates.checkin);
    expect(res.data.bookingdates.checkout).to.equal(bookingData.bookingdates.checkout);
    expect(res.data.additionalneeds).to.equal(bookingData.additionalneeds);
  });

  it('should delete the booking', async () => {
    const res = await axios.delete(`${BASE_URL}/booking/${bookingId}`, {
      headers: {
        'Cookie': `token=${token}`,
        'Content-Type': 'application/json'
      }
    });

    expect(res.status).to.equal(201);
    console.log('Booking deleted successfully.');
  });
});