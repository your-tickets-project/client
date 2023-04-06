import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  FieldHelperProps,
  FieldInputProps,
  FieldMetaProps,
  FormikErrors,
  FormikState,
  FormikTouched,
  useFormik,
} from 'formik';
import * as Yup from 'yup';

interface Values {
  [name: string]: any;
}

export interface FormType {
  initialValues: Values;
  initialErrors: FormikErrors<unknown>;
  initialTouched: FormikTouched<unknown>;
  initialStatus: any;
  handleBlur: {
    (e: React.FocusEvent<any>): void;
    <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
  };
  handleChange: {
    (e: React.ChangeEvent<any>): void;
    <T_1 = string | React.ChangeEvent<any>>(
      field: T_1
    ): T_1 extends React.ChangeEvent<any>
      ? void
      : (e: string | React.ChangeEvent<any>) => void;
  };
  handleReset: (e: any) => void;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => void;
  resetForm: (nextState?: Partial<FormikState<Values>> | undefined) => void;
  setErrors: (errors: FormikErrors<Values>) => void;
  setFormikState: (
    stateOrCb:
      | FormikState<Values>
      | ((state: FormikState<Values>) => FormikState<Values>)
  ) => void;
  setFieldTouched: (
    field: string,
    touched?: boolean,
    shouldValidate?: boolean | undefined
  ) => Promise<FormikErrors<Values>> | Promise<void>;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<FormikErrors<Values>> | Promise<void>;
  setFieldError: (field: string, value: string | undefined) => void;
  setStatus: (status: any) => void;
  setSubmitting: (isSubmitting: boolean) => void;
  setTouched: (
    touched: FormikTouched<Values>,
    shouldValidate?: boolean | undefined
  ) => Promise<FormikErrors<Values>> | Promise<void>;
  setValues: (
    values: React.SetStateAction<Values>,
    shouldValidate?: boolean | undefined
  ) => Promise<FormikErrors<Values>> | Promise<void>;
  submitForm: () => Promise<any>;
  validateForm: (values?: Values) => Promise<FormikErrors<Values>>;
  validateField: (name: string) => Promise<void> | Promise<string | undefined>;
  isValid: boolean;
  dirty: boolean;
  unregisterField: (name: string) => void;
  registerField: (name: string, { validate }: any) => void;
  getFieldProps: (nameOrOptions: any) => FieldInputProps<any>;
  getFieldMeta: (name: string) => FieldMetaProps<any>;
  getFieldHelpers: (name: string) => FieldHelperProps<any>;
  validateOnBlur: boolean;
  validateOnChange: boolean;
  validateOnMount: boolean;
  values: Values;
  errors: FormikErrors<Values>;
  touched: FormikTouched<Values>;
  isSubmitting: boolean;
  isValidating: boolean;
  status?: any;
  submitCount: number;
}

interface FormProps {
  children: React.ReactNode;
  extraOffsetTop?: number;
  initialValues?: Values;
  parentScrollToSelector?: string;
  onFinish?: (values: any) => void;
  onForm?: (form: FormType) => void;
}

interface ItemProps {
  children: React.ReactElement;
  label: string;
  name: string;
  rules?: {
    disabled?: boolean;
    max?: number;
    message?: string;
    min?: number;
    required?: boolean;
    type?: 'text' | 'number' | 'email';
    validator?: (
      value: any,
      formValues: any
    ) => { isValid: boolean; message?: string };
  };
}

const FormContext = createContext<
  | {
      activeFieldName?: string;
      formik: FormType;
      setActiveFieldName: React.Dispatch<
        React.SetStateAction<string | undefined>
      >;
      setValidations: React.Dispatch<React.SetStateAction<{}>>;
    }
  | undefined
>(undefined);

export const Form = ({
  children,
  initialValues,
  extraOffsetTop,
  parentScrollToSelector,
  onFinish,
  onForm,
}: FormProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [validations, setValidations] = useState({});
  const [activeFieldName, setActiveFieldName] = useState<string | undefined>();

  const formik = useFormik({
    initialValues: initialValues ?? {},
    validateOnBlur: false,
    validateOnChange: true,
    validateOnMount: false,
    validationSchema: Yup.object(validations),
    onSubmit: async (data) => {
      onFinish?.(data);
    },
  });

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    onForm?.(formik);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) return;
    if (!formik.isSubmitting) return;

    const errorFieldsName = Object.keys(formik.errors);
    if (!parentScrollToSelector || !errorFieldsName.length) return;

    let $container: Window | HTMLElement | null = null;
    if (parentScrollToSelector === 'window') {
      $container = window;
    } else {
      $container = document.querySelector(
        `${parentScrollToSelector}`
      ) as HTMLElement | null;
    }

    const $field = document.querySelector(
      `#${errorFieldsName[0]}-item`
    ) as HTMLElement | null;

    if ($container && $field) {
      $container.scrollTo({
        top: $field.offsetTop - (extraOffsetTop || 0),
        behavior: 'smooth',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, formik.errors, formik.isSubmitting]);

  return (
    <FormContext.Provider
      value={{ activeFieldName, formik, setActiveFieldName, setValidations }}
    >
      <form className="ui-form" role="form" onSubmit={formik.handleSubmit}>
        {children}
      </form>
    </FormContext.Provider>
  );
};

const Item = ({ children, label, name, rules }: ItemProps) => {
  const child = React.Children.only(children);

  const formContext = useContext(FormContext);
  if (!formContext) {
    throw new Error('This <Item/> must be used within a <Form/> component.');
  }

  const { formik, setValidations } = formContext;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const validation = yupTypeValidation[rules?.type ?? 'text']?.({
      label,
      max: rules?.max,
      message: rules?.message,
      min: rules?.min,
      required: !!rules?.required,
    });

    setValidations((state: any) => ({
      ...state,
      [name]: rules?.validator
        ? // @ts-ignore
          validation.test({
            test(value: string | undefined, ctx: Yup.TestContext<any>) {
              if (!value || !rules?.validator) return true;

              const result = rules.validator(value, formik.values);
              if (!result.isValid) {
                return ctx.createError({ message: result.message });
              }
              return true;
            },
          })
        : validation,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, formik.values, rules]);

  return (
    <div className="ui-form_group" id={`${name}-item`}>
      <label
        className={`ui-form_label ${
          rules?.required ? 'required' : 'not-required'
        }`}
        htmlFor={name}
      >
        {label}
      </label>
      {React.cloneElement(child, {
        disabled: !!rules?.disabled,
        error: !!formik.errors[name]?.length || child.props.error,
        max: rules?.max && rules?.type === 'number' ? rules.max : undefined,
        maxLength:
          rules?.max && rules?.type !== 'number' ? rules.max : undefined,
        min: rules?.max && rules?.type === 'number' ? rules.min : undefined,
        name,
        type: rules?.type ?? 'text',
        showCount: !!(rules?.max && rules?.type !== 'number'),
        value: formik.values[name] || '',
        onChange: formik.handleChange,
      })}
      {!!formik.errors[name]?.length && (
        <span className="ui-form_error">
          {(formik.errors[name] as string).includes('must be a `number` type')
            ? rules?.message || (formik.errors[name] as string)
            : (formik.errors[name] as string)}
        </span>
      )}
    </div>
  );
};

Form.Item = Item;

const yupTypeValidation = {
  text({
    label,
    max,
    message,
    min,
    required,
  }: {
    label: string;
    max?: number;
    message?: string;
    min?: number;
    required: boolean;
  }) {
    let validation = Yup.string().trim();
    if (max !== undefined) {
      validation = validation.max(
        max,
        `${label} must be at most ${max} characters`
      );
    }
    if (min !== undefined) {
      validation = validation.min(
        min,
        `${label} must be at least ${min} characters`
      );
    }
    if (required) {
      validation = validation.required(
        message || `${label} is a required field`
      );
    }
    return validation;
  },
  email({
    label,
    max,
    message,
    min,
    required,
  }: {
    label: string;
    max?: number;
    message?: string;
    min?: number;
    required: boolean;
  }) {
    let validation = Yup.string()
      .email(`${label} must be a valid email`)
      .trim();
    if (max !== undefined) {
      validation = validation.max(
        max,
        `${label} must be at most ${max} characters`
      );
    }
    if (min !== undefined) {
      validation = validation.min(
        min,
        `${label} must be at least ${min} characters`
      );
    }
    if (required) {
      validation = validation.required(
        message || `${label} is a required field`
      );
    }
    return validation;
  },
  number({
    label,
    max,
    message,
    min,
    required,
  }: {
    label: string;
    max?: number;
    message?: string;
    min?: number;
    required: boolean;
  }) {
    let validation = Yup.number();
    if (max !== undefined) {
      validation = validation.max(
        max,
        `${label} must be less than or equal to ${max}`
      );
    }
    if (min !== undefined) {
      validation = validation.min(
        min,
        `${label} must be greater than or equal to ${min}`
      );
    }
    if (required) {
      validation = validation.required(
        message || `${label} is a required field`
      );
    }
    return validation;
  },
};
