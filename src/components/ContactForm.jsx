import { zodResolver } from '@hookform/resolvers/zod';
import { SendHorizontal } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from './ui';
import { useToast } from './ui/use-toast';

const formSchema = z.object({
  name: z.string().min(2).max(20),
  email: z.string().email(),
  message: z.string().min(10).max(50),
});

const ContactForm = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
  });
  const { toast } = useToast();

  const onSubmit = async (values) => {
    console.log('onSubmit: ');
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const resp = toast({
      title: 'Success',
      variant: 'success',
      description: 'Your message was sent successfully!',
    });
    form.reset({
      name: '',
      email: '',
      message: '',
    });

    // const resp = await fetch('https://formspree.io/f/meqyvqyj', {
    //   method: 'POST',
    //   body: formData,
    //   headers: {
    //     Accept: 'application/json',
    //   },
    // });
    // if (resp.ok) {
    //   const data = await resp.json();
    //   console.log('DATA ', data);
    //   toast({
    //     title: 'Success',
    //     description: 'Your message was sent successfully!',
    //   });
    //   form.reset();
    // } else {
    //   toast({
    //     variant: 'destructive',
    //     title: 'Uh oh! Something went wrong.',
    //     description: 'There was a problem with your request.',
    //   });
    // }
  };
  return (
    <Form {...form}>
      <form className='space-y-2'>
        <FormField
          name='name'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='email'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name='message'
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder='Type your message here.'
                  rows={6}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='py-2'>
          <Button onClick={form.handleSubmit(onSubmit)}>
            <SendHorizontal className='mr-2 h-4 w-4' />
            Send Message
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ContactForm;
