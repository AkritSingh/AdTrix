import React, { memo } from 'react';
import Button from '../../atoms/Button/button';


interface InputArrProps {
    name?: string;
    values?: any;
    onChange: (any)=>void,
 }
const InputArr = memo(({ name, values, onChange }: InputArrProps) => {
    const handleAdd = () => {
        onChange([...values, '']); // 🔹 Add new input field
    };

    const handleDelete = (index) => {
        onChange(values.filter((_, i) => i !== index)); // 🔹 Remove input field
    };

    const handleInputChange = (e, index) => {
        const newValues = [...values];
        newValues[index] = e.target.value;
        onChange(newValues); // 🔹 Update parent form signal
    };

    return (
        <div className='inputList'>
            {values.map((item, index) => (
                <div key={`inputlist_input_${index}`} className='dynInput'>
                    <input
                        type="text"
                        name={name}
                        value={item}
                        onChange={(e) => handleInputChange(e, index)}
                    />
                    <Button classname="white-c btn light-red operator" onclick={() => handleDelete(index)}>−</Button>
                </div>
            ))}
            <div className='mt-10 col-2 flex-end'>
                Add Items
                <Button classname="white-c btn light-green operator" onclick={handleAdd}>+</Button>
            </div>
        </div>
    );
});

export default InputArr;
