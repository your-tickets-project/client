// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  };

HTMLCanvasElement.prototype.getContext = jest.fn();

jest.mock('next/router', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
    };
  },
}));

jest.mock('nanoid', () => ({
  nanoid() {
    return 'unique-id';
  },
  customAlphabet() {
    return () => '1';
  },
}));

jest.mock('server/utils/email', () => ({ sendEmail() {} }));
jest.mock('server/utils/pdf', () => ({
  generateBufferTicketPdf() {
    return Promise.resolve(Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]));
  },
  mergeBufferPdf() {
    return Promise.resolve(Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]));
  },
}));

jest.mock('server/data/media/media.data', () => ({
  createMedia() {
    return Promise.resolve([{ Key: 'test', name: 'test' }]);
  },
}));
