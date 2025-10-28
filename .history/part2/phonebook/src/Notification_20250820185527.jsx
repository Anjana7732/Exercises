const Notification=({ message, type}) => {
    if (message === null) {
        return null
    }
    return (
        <div className={`notification ${typ}`}>
            {message}
        </div>
    )
}
export default Notification