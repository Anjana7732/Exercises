import mongoose from 'mongoose';

// Get command-line arguments
const args = process.argv.slice(2);

if (args.length < 1) {
  console.log('Please provide the password as the first argument');
  process.exit(1);
}

const password = args[0];
const name = args[1];
const number = args[2];

// Replace <username> with your MongoDB Atlas username
const url = `mongodb+srv://<username>:${password}@cluster0.mongodb.net/phonebook?retryWrites=true&w=majority`;

// Connect to MongoDB
mongoose.connect(url)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);

if (!name || !number) {
  // Only password provided -> list all entries
  Person.find({})
    .then(persons => {
      console.log('phonebook:');
      persons.forEach(person => {
        console.log(`${person.name} ${person.number}`);
      });
    })
    .catch(err => console.error(err))
    .finally(() => mongoose.connection.close());
} else {
  // Add a new person
  const person = new Person({
    name,
    number
  });

  person.save()
    .then(() => {
      console.log(`added ${name} number ${number} to phonebook`);
    })
    .catch(err => console.error(err))
    .finally(() => mongoose.connection.close());
}
