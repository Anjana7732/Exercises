import { useState } from 'react'

const CreateNew = ({ addNew }) => {
	const [content, setContent] = useState('')
	const [author, setAuthor] = useState('')
	const [info, setInfo] = useState('')

	const handleSubmit = (event) => {
		event.preventDefault()
		addNew({ content, author, info, votes: 0 })
		setContent('')
		setAuthor('')
		setInfo('')
	}

	return (
		<div>
			<h2>Create a new anecdote</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label>
						content
						<input value={content} onChange={(e) => setContent(e.target.value)} />
					</label>
				</div>
				<div>
					<label>
						author
						<input value={author} onChange={(e) => setAuthor(e.target.value)} />
					</label>
				</div>
				<div>
					<label>
						url for more info
						<input value={info} onChange={(e) => setInfo(e.target.value)} />
					</label>
				</div>
				<button type="submit">create</button>
			</form>
		</div>
	)
}

export default CreateNew


