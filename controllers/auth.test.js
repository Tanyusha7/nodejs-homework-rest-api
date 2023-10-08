/*
._given user;
. if null = error user not exist;
._given token;
._return token;
._if '' - error "Not Autorized";
._return object with email and subscription and type of data String;
._ if only email - error subscription is required; 
._ if number, boolean - error type must to be string
._ if [], string,  - error is awaiting an object
*/

const { signin } = require("./auth");
const { User } = require("../models/user");
const { comparePassword, token } = require("./auth");

jest.mock("../models/user");
jest.mock("./auth");

jest.mock("./auth", () => ({
  signin: jest.fn(() => {}),
  comparePassword: jest.fn(() => true),
  token: jest.fn(() => "get_token"),
}));

const req = {
  body: {
    email: "fake_email",
    password: "fake_password",
    subscription: "pro",
    id: "4",
  },
};

const res = {
  status: jest.fn(() => 200),
  json: jest.fn(() => "token"),
};

describe("test user/signin function", () => {
  // test("user is not found", async () => {
  //   User.findOne.mockImplementationOnce(() => null);
  //   await signin.mockImplementation(req, res);
  //   // expect(User.findOne).toHaveBeenCalledWith({null);
  //   expect(res.status).toHaveBeenCalledWith(401);
  //   expect(res.json).toThrow("Email or password is wrong");
  // });

  // test("user is true, check password, if it is wrong", async () => {

  //   User.findOne.mockImplementationOnce(() => ({
  //     id: 1,
  //     email: "email@moi.com",
  //   }));
  //   comparePassword.mockResolvedValueOnce(false);
  //   await signin(req, res);
  //   expect(res.status).toHaveBeenCalledWith(401);
  //   expect(res.json).toThrow("Email or password is wrong");
  // });

  test("user is login true, get token", async () => {
    await User.findOne.mockImplementation(() => ({
      email: "fake_email",
      subscription: "pro",
    }));
    await comparePassword(true);
    token.mockResolvedValueOnce("get_token");
    await User.findByIdAndUpdate.mockResolvedValueOnce(() => ({
      id: "user_id",
      token: "token",
    }));
    // await signin.mockImplementation(() => req, res);

    expect(comparePassword()).toBe(true);
    expect(res.status()).toBe(200);
    expect(res.json()).toBe("token");
    expect(User.findOne()).toStrictEqual({
      email: expect.any(String),
      subscription: expect.any(String),
    });
  });
});

// describe("test user/signin function", () => {
//   test("user is  exist return 200, User is exist", async () => {
//     await supertest(signin).post("/login").expext(200);
//     // .send({ email: "tiuyul@mail.com", password: "123456&" });
//     // User.findOne.mockImplementationOnce(() => true);

//     // expext(response.status).toBe(true);
//   });
// });
