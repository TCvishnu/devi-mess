import { useId } from "react";
import ErrorBox from "./ErrorBox";

type CheckBoxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  errorMessage?: string;
  isError?: boolean;
};

const CheckBox: React.FC<CheckBoxProps> = ({
  label,
  errorMessage,
  isError,
  ...props
}) => {
  const id: string = useId();

  return (
    <div className=" w-full font-semibold ">
      <div className=" w-full flex items-center gap-3">
        {label && (
          <label htmlFor={id} className=" opacity-60">
            {label}
          </label>
        )}
        <input id={id} className=" w-4 h-4" type="checkbox" {...props} />
      </div>

      {isError && <ErrorBox isError={isError} message={errorMessage} />}
    </div>
  );
};

export default CheckBox;
