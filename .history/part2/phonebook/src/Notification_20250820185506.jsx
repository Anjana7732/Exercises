const Notification=({ message, type}) => {
    if (message === null) {
        return null
    }
    return (
        <div className='erro>
            {message}
        </div>
    )
}
export default Notification