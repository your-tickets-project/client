import React, { createContext, useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export declare type StoreValue = any;

export interface Store {
  [name: string]: StoreValue;
}

interface FormProps {
  onFinish: (values: any) => void;
  children: React.ReactNode;
  initialValues?: Store;
}

interface ItemProps {
  children: React.ReactElement;
  label: React.ReactNode;
  name: string;
  rules?: {
    required?: boolean;
    message?: string;
    type?: 'string' | 'number' | 'boolean' | 'email';
  };
}

const FormContext = createContext<any>(undefined);

export const Form = ({ children, initialValues, onFinish }: FormProps) => {
  const [validations, setValidations] = useState({});

  const formik = useFormik({
    initialValues: initialValues ?? {},
    validationSchema: Yup.object(validations),
    onSubmit: async (data) => {
      onFinish(data);
    },
  });

  return (
    <FormContext.Provider value={{ formik, setValidations }}>
      <form className="ui-form" onSubmit={formik.handleSubmit}>
        {children}
      </form>
    </FormContext.Provider>
  );
};

const Item = ({ children, label, name, rules }: ItemProps) => {
  const child = React.Children.only(children);

  const formContext = useContext(FormContext);
  if (!formContext) {
    throw new Error('This <Item> must be used within a <Form> component');
  }

  const { formik, setValidations } = formContext;

  useEffect(() => {
    const validation = yupTypeValidation[rules?.type ?? 'string']?.({
      required: !!rules?.required,
    });

    setValidations((state: any) => ({
      ...state,
      [name]: validation,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="ui-form-group">
      <label
        className={`ui-form-group-label ${
          rules?.required ? 'is-required' : 'is-not-required'
        }`}
        htmlFor={name}
      >
        {label}
      </label>
      {React.cloneElement(child, {
        name,
        error: formik.errors[name]?.length,
        onChange: formik.handleChange,
        value: formik.values[name],
      })}
      {rules?.required && formik.errors[name]?.length && (
        <span className="ui-form-error">
          {rules?.message || formik.errors[name]}
        </span>
      )}
    </div>
  );
};

Form.Item = Item;

const yupTypeValidation = {
  string({ required }: { required: boolean }) {
    const validation = Yup.string().trim();
    if (required) {
      return validation.required();
    }
    return validation;
  },
  email({ required }: { required: boolean }) {
    const validation = Yup.string().email().trim();
    if (required) {
      return validation.required();
    }
    return validation;
  },
  number({ required }: { required: boolean }) {
    const validation = Yup.number();
    if (required) {
      return validation.required();
    }
    return validation;
  },
  boolean({ required }: { required: boolean }) {
    const validation = Yup.boolean();
    if (required) {
      return validation.required();
    }
    return validation;
  },
};
