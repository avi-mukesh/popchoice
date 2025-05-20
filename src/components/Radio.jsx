const Radio = ({value, name, selected, handleChange}) => {
  return (
    <div className='flex gap-1 items-center'>
        <label className="text-slate-100">{value}</label>
        <input type='radio' name={name} value={value} checked={selected === value} onChange={handleChange}/>
    </div>
  );
};

export default Radio;
