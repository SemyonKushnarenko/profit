import React, { useState } from 'react'
import { IFeedback } from '../../interfaces/feedback-interface';
import { FeedbackService } from '../../services/FeedbackService';
import './FeedbackForm.scss'

const FeedbackForm: React.FC = () => {
  const phoneDefault = '+7 (___) ___-__-__'
  let [name, setName] = useState<string>('');
  let [isValidName, setIsValidName] = useState<boolean>(true);
  let [phoneMask, setPhoneMask] = useState<string>(phoneDefault);
  let [isValidPhone, setIsValidPhone] = useState<boolean>(true);
  let [email, setEmail] = useState<string>('');
  let [isValidEmail, setIsValidEmail] = useState<boolean>(true);
  let [isValidMessage, setIsValidMessage] = useState<boolean>(true);
  let [birthday, setBirthday] = useState<string>('');
  let [message, setMessage] = useState<string>('');
  const invalidClassName = 'invalid';

  const feedbackService = new FeedbackService()

  function handleName(e: React.ChangeEvent<HTMLInputElement>) {
    const nameInput = e.target
    const { value } = nameInput
    if (nameInput) {   
      if (!value.match(/[a-zA-Z]{3,30}\s+[a-zA-Z]{3,30}$/)) {
        setIsValidName(false);
        nameInput.classList.add(invalidClassName)
      }
      else {
        setIsValidName(true)
        nameInput.classList.remove(invalidClassName)
      }
      setName(value.toUpperCase());
    }
  }
  function handleEmail(e: React.ChangeEvent<HTMLInputElement>) {
    const emailInput = e.target
    const { value } = emailInput
    if (emailInput) {   
      if (!value.match(/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/)) {
        setIsValidEmail(false);
        emailInput.classList.add(invalidClassName)
      }
      else {
        setIsValidEmail(true)
        emailInput.classList.remove(invalidClassName)
      }
      setEmail(value);
    }
  }
  function maskPhone(value: string): string | undefined {
    const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    const symbols = ['_', '-', '']
    const digit = value.slice(-1)
    const firstBlankSymbol = 4

    if (!digits.some(item => item === digit || symbols.some(item => item === digit))) return
    
    if (phoneMask.length > value.length) {
        setIsValidPhone(false)
      if (phoneMask.indexOf('_') === firstBlankSymbol) {
        return
      }
      let nums = phoneMask.replace(/\D/g,'')
      const res = phoneMask.split('')
      res.splice(phoneMask.lastIndexOf(nums[nums.length - 1]), 1, '_')
      return res.join('')
    }
    if (!digits.some(item => item === digit)) return
    const amountOfNumbers = 11
    if (phoneMask.replace(/\D/g,'').length < amountOfNumbers - 2) {
      setIsValidPhone(false)
    }
    if (phoneMask.indexOf('_') === -1) return

    return phoneMask.replace('_', value.slice(-1))
  }
  function handlePhone(e: React.ChangeEvent<HTMLInputElement>) {
    const phoneInput = e.target
    if (phoneInput) {
      setIsValidPhone(true)
      const phoneMaskAttempt = maskPhone(phoneInput.value)
      if (isValidPhone) {
        phoneInput.classList.remove(invalidClassName)
      } else {
        phoneInput.classList.add(invalidClassName)
      }
      setPhoneMask(phoneMaskAttempt ? phoneMaskAttempt : phoneMask)
    };
  }
  function handleMessage(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const messageInput = e.target
    const { value } = messageInput
    if (messageInput) {
      if (value.length >= 10 && value.length <= 300) {
        messageInput.classList.remove(invalidClassName)
        setIsValidMessage(true)
      } else {
        setIsValidMessage(false)
        messageInput.classList.add(invalidClassName)
      }

      setMessage(value)
    };
  }
  function handleBirthday(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target) setBirthday(e.target.value);
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();

    if (!isValidName || !isValidEmail || !isValidPhone || !isValidMessage) return

    const submitBtn = (e.target as HTMLFormElement).querySelector('.form__submit') as HTMLInputElement;
    if (submitBtn)
      submitBtn.disabled = true;

    const form = e.target as HTMLFormElement;
    const feedback: IFeedback = {
      name: form.fullName.value,
      email: form.email.value,
      phone: form.phone.value,
      birthday: form.birthday.value,
      message: form.message.value
    }

    let res = await feedbackService.sendData(feedback)

    if (submitBtn)
      submitBtn.disabled = false;

    if (res === 'success') {
      form.classList.add('success')
      setName('')
      setEmail('')
      setPhoneMask(phoneDefault)
      setBirthday('')
      setMessage('')

      return
    }
    form.classList.add('error')
  }

  return (
    <form className='form'
        onSubmit={submitForm}
        >
    <div className='form__block'>
      <label htmlFor="name" >Your name:</label>
      <input className="form__input"
          id='name'
          name="fullName"
          type="text"
          value={name}
          onInput={handleName}
          required/>
      <p className='invalid_message'>Input your first- and lastname through the space symbol</p>
    </div>
      <div className='form__block'>
        <label htmlFor="email" >Your email:</label>
        <input className="form__input"
            id='email'
            name='email'
            type="text" 
            value={email}
            onInput={handleEmail}
            required/>
        <p className='invalid_message'>Input your email in format: "test@test.test"</p>
      </div>
      <div className='form__block'>
        <label htmlFor="phone" >Your phone:</label>
        <input className="form__input"
            id='phone'
            name="phone"
            type="text" 
            value={phoneMask}
            placeholder="+7(000)000-00-00"
            onInput={handlePhone}
            required/>
        <p className='invalid_message'>Input your phone in format: "+7 (000) 123-45-67"</p>
      </div>
      <div className='form__block'>
        <label htmlFor="" >Your birthday:</label>
        <input className="form__input"
            name="birthday"
            value={birthday}
            type="date"
            onInput={handleBirthday}
            required/>
      </div>
      <div className='form__block'>
        <label htmlFor="" >Your message:</label>
        <textarea className="form__input form__message"
            name="message"
            value={message}
            onInput={handleMessage}
            required
            minLength={10}
            maxLength={300} />
        <p className='invalid_message'>Your message should contain at least 10 symbols and 300 symbols as max</p>
      </div>
      <input className='form__submit' type='submit' value='Submit'/>
      <p className='success-message'>Your feedback was received</p>
      <p className='error-message'>Sorry, something goes wrong... Please repeat</p>
    </form>
  )
}

export default FeedbackForm