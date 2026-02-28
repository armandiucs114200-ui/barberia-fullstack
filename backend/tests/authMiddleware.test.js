const jwt = require('jsonwebtoken');
const authMiddleware = require('../src/middleware/authMiddleware');

describe('JWT Auth Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
        process.env.JWT_SECRET = 'test_secret';
    });

    it('should return 401 if no authorization header is provided', () => {
        authMiddleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'No token provided, access denied' });
    });

    it('should return 401 if token is invalid', () => {
        req.headers.authorization = 'Bearer invalid_token';
        authMiddleware(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
    });

    it('should call next and attach user to req if token is valid', () => {
        const userPayload = { id: '123', role: 'usuario' };
        const token = jwt.sign(userPayload, process.env.JWT_SECRET);
        req.headers.authorization = `Bearer ${token}`;

        authMiddleware(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(req.user).toMatchObject(userPayload);
    });
});
