const { transferRequest } = require("../controllers/studentRequestsController");
const StudentRequest = require("../models/StudentRequest");

describe("transferRequest", () => {
  it("should transfer the request to another staff member", async () => {
    const req = {
      params: { id: "123" },
      body: { newStaffId: "456" }
    };

    const res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    const spy = jest.spyOn(StudentRequest, "findByIdAndUpdate").mockResolvedValue({
      _id: "123",
      staff: "456"
    });

    await transferRequest(req, res);

    expect(spy).toHaveBeenCalledWith("123", { staff: "456" }, { new: true });
    expect(res.json).toHaveBeenCalledWith({
      message: "Request transferred successfully",
      request: { _id: "123", staff: "456" }
    });

    spy.mockRestore();
  });

  it("should return 404 if request not found", async () => {
    const req = {
      params: { id: "not-exist" },
      body: { newStaffId: "456" }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const spy = jest.spyOn(StudentRequest, "findByIdAndUpdate").mockResolvedValue(null);

    await transferRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Request not found" });

    spy.mockRestore();
  });

  it("should return 500 if there is a server error", async () => {
    const req = {
      params: { id: "123" },
      body: { newStaffId: "456" }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const spy = jest.spyOn(StudentRequest, "findByIdAndUpdate").mockRejectedValue(new Error("DB error"));

    await transferRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: "Error transferring request",
      error: expect.any(String)
    }));

    spy.mockRestore();
  });
});
