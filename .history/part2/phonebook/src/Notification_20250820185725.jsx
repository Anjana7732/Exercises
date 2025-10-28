const Notification=({ message, type}) => {
    if (message === null) {
        return null
    }
    return (
        <div className={`notification ${ty}`}>
            {message}
        </div>
    )
}
export default Notification