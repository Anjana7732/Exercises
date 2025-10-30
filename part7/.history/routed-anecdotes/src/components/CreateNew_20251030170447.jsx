import { useField } from '../hooks'

const CreateNew = ({ addNew }) => {
	const content = useField('text')
	const author = useField('text')
	const info = useField('text')

	const handleSubmit = (event) => {
		event.preventDefault()
		addNew({ content: content.value, author: author.value, info: info.value, votes: 0 })
		content.reset()
		author.reset()
		info.reset()
	}

	const handleReset = (event) => {
		event.preventDefault()
		content.reset()
		author.reset()
		info.reset()
	}

	const { reset: _rc, ...contentInput } = content
	const { reset: _ra, ...authorInput } = author
	const { reset: _ri, ...infoInput } = info

	return (
		<div>
			<h2>Create a new anecdote</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label>
						content
						<input {...contentInput} />
					</label>
				</div>
				<div>
					<label>
						author
						<input {...authorInput} />
					</label>
				</div>
				<div>
					<label>
						url for more info
						<input {...infoInput} />
					</label>
				</div>
				<button type="submit">create</button>
				<button onClick={handleReset}>reset</button>
			</form>
		</div>
	)
}

export default CreateNew


