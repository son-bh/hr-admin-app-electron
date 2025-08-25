import { DatePickerController } from '@/components/form/controller';
import { addDays } from 'date-fns';
import { useFormContext } from 'react-hook-form';
import flatpickr from 'flatpickr';
import Hook = flatpickr.Options.Hook;
import { Instance } from 'flatpickr/dist/types/instance';

interface IShiftRangeDateProps {
  onChangeEndDate?: Hook;
}

export default function ShiftRangeDate({
  onChangeEndDate,
}: IShiftRangeDateProps) {
  const { control, watch, setValue } = useFormContext();
  const watchStartDate = watch('startDate');
  console.log('🚀 ~ ShiftRangeDate ~ watchStartDate:', watchStartDate);

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      <DatePickerController
        control={control}
        defaultDate={new Date()}
        name='startDate'
        label='Ngày bắt đầu'
        required
        options={{ minDate: addDays(new Date(), 1) }}
        onChange={() => {
          const fp = flatpickr('#endDate');

          (fp as Instance).clear();
          setValue('endDate', null);
        }}
      />
      <DatePickerController
        control={control}
        // defaultDate={watchStartDate}
        name='endDate'
        label='Ngày kết thúc'
        // disabled
        required
        options={{
          minDate: watchStartDate,
          maxDate: addDays(new Date(watchStartDate), 31),
        }}
        onChange={onChangeEndDate}
      />
    </div>
  );
}
