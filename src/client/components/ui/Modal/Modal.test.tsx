import React, { useState } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Modal } from '.';

describe('when <Modal/> is mounted', () => {
  beforeEach(() => {
    render(
      <Modal title="test title" isShowModal>
        Here is content of Modal
      </Modal>
    );
  });

  test('should display the title', () => {
    expect(screen.getByText('test title')).toBeInTheDocument();
  });

  test('should display the default footer elements', () => {
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /confirm/i })
    ).toBeInTheDocument();
  });

  test('should display the content', () => {
    expect(screen.getByText('Here is content of Modal')).toBeInTheDocument();
  });
});

describe('when the developer wants to display differents footer', () => {
  test('should display a custom footer', () => {
    render(
      <Modal title="test title" isShowModal footer="custom footer">
        Here is content of Modal
      </Modal>
    );

    expect(screen.getByText('custom footer')).toBeInTheDocument();
  });

  test('should not display the footer', () => {
    render(
      <Modal title="test title" isShowModal footer={null}>
        Here is content of Modal
      </Modal>
    );

    expect(
      screen.queryByRole('button', { name: /confirm/i })
    ).not.toBeInTheDocument();
  });
});

describe('when the user wants to close the modal', () => {
  const ModalTester = () => {
    const [open, setOpen] = useState(true);
    return (
      <div>
        <Modal
          isShowModal={open}
          title="test title"
          maskClosable
          onCancel={() => setOpen(false)}
        >
          Here is content of Modal
        </Modal>
      </div>
    );
  };

  beforeEach(() => {
    render(<ModalTester />);
  });

  test('should close the modal clicking the close icon', async () => {
    expect(screen.getByText('test title')).toBeInTheDocument();

    fireEvent.click(screen.getByTitle('close-icon'));

    await waitFor(
      () => {
        expect(screen.queryByText('test title')).not.toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  test('should close the modal clicking on the overlay', async () => {
    expect(screen.getByText('test title')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('ui-modal_overlay-element'));

    await waitFor(
      () => {
        expect(screen.queryByText('test title')).not.toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });

  test('should close the modal clicking on the cancel button', async () => {
    expect(screen.getByText('test title')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'cancel' }));

    await waitFor(
      () => {
        expect(screen.queryByText('test title')).not.toBeInTheDocument();
      },
      { timeout: 1000 }
    );
  });
});

describe('when the developer wants to execute the actions', () => {
  const handleCancel = jest.fn();
  const handleConfirm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    render(
      <Modal
        isShowModal
        maskClosable
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      >
        Here is content of Modal
      </Modal>
    );
  });

  test('should call the onCancel function', () => {
    fireEvent.click(screen.getByTestId('ui-modal_overlay-element'));
    fireEvent.click(screen.getByTitle('close-icon'));
    fireEvent.click(screen.getByRole('button', { name: 'cancel' }));
    expect(handleCancel).toHaveBeenCalledTimes(3);
  });

  test('should call the onConfirm function', () => {
    fireEvent.click(screen.getByRole('button', { name: 'confirm' }));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });
});
