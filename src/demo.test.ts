describe("test suite", () => {
    it("test 1", () => expect(1).toBe(1, "this test should not fail"));
    it("test 2", () => expect(false).toBeFalsy());
});