import { createAnecdote } from '../src/services/anecdotes.js'

async function run() {
  try {
    await createAnecdote('abc')
    console.log('SHORT_TEST: should have failed')
  } catch (e) {
    console.log('SHORT_TEST_ERROR:', e.message)
  }

  try {
    const res = await createAnecdote('this is valid')
    console.log('VALID_TEST_OK:', res && res.content && res.id ? 'ok' : 'bad')
  } catch (e) {
    console.log('VALID_TEST_ERROR:', e.message)
  }
}

run()


