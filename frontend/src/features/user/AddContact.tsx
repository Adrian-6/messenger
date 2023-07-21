import PersonAddIcon from '@mui/icons-material/PersonAdd';
import React, { useRef, useState } from 'react';
import { useAddContactMutation } from './userApiSlice';

const AddContact = () => {

    const [addContact] = useAddContactMutation()
    const ref = useRef<HTMLDivElement>(null);
    const [id, setId] = useState('')
    const [visible, setVisible] = useState(false)

    const handleSubmit = async (tagetEmail: string, e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        await addContact(tagetEmail)
        setId('')
    }

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setVisible(!visible)
        if (ref.current !== null && ref.current !== undefined) {
            ref.current.focus();
        }
    }

    return (
        <div className="contact-add">
            <button className='contact-add_btn' title="Click to add a new contact" onClick={(e) => handleClick(e)}><PersonAddIcon /></button>
            <form onSubmit={(event) => handleSubmit(id, event)} className="contact-add_form">
                <input
                    type='text'
                    name='add contact'
                    className='contact-add_input'
                    ref={ref as React.LegacyRef<HTMLInputElement>}
                    placeholder={'Add a new contact by email'}
                    onChange={(e) => { setId(e.target.value) }} value={id}>
                </input>
            </form>
        </div>
    )
}

export default AddContact