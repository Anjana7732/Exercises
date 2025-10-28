const Notification=({ message, type}) => {
    if (message === null) {
        return null
    }

    console.log("Notification type:", type);
    return (
        <div className={`notification ${type}`}>
            {message}
        </div>
    )
}
export default Notification