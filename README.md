# calculateFee

## Application for calculating transaction fees.

To run the application, enter the command

```
npm install
```

Then

```
node app.js ./input.json
```

Where `./input.json` is a path to `json` file.
The file must contain an array of objects of the given structure

```
{
    "date": "2016-01-05", // operation date in format `Y-m-d`
    "user_id": 1, // user id, integer
    "user_type": "natural", // user type, one of “natural”(natural person) or “juridical”(legal person)
    "type": "cash_in", // operation type, one of “cash_in” or “cash_out”
    "operation": {
        "amount": 200, // operation amount(for example `2.12` or `3`)
        "currency": "EUR" // operation currency `EUR`
    }
}
```

To run the tests, enter the command

```
npm run test
```
