const Notification=({ message, ty}) => {
    if (message === null) {
        return null
    }
    return (
        <div className='error'>
            {message}
        </div>
    )
}
export default Notification