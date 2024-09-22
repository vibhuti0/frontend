"use client";
import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

// Define the response type expected from the API
interface ApiResponse {
  numbers: string[];
  alphabets: string[];
  highest_lowercase_alphabet: string[];
}

export default function Home() {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [response, setResponse] = useState<ApiResponse | null>(null); // Use the ApiResponse type
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Ensure TypeScript knows the structure of the response data
      const res = await axios.post<ApiResponse>('https://bajaj-six-tau.vercel.app/bfhl', JSON.parse(jsonInput));
      setResponse(res.data); // Now TypeScript knows res.data is of type ApiResponse
    } catch (error: any) { // You can also narrow down the error type as explained before
      console.error('Invalid JSON or server error', error.message);
    }
  };

  const handleFieldChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { options } = e.target;
    const selected: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedFields(selected);
  };

  return (
    <div>
      <h1>BFHL Dev Challenge</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Enter JSON data"
          value={jsonInput}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setJsonInput(e.target.value)}
          rows={5}
        />
        <br />
        <button type="submit">Submit</button>
      </form>

      {response && (
        <>
          <h2>Response</h2>
          <select multiple onChange={handleFieldChange}>
            <option value="numbers">Numbers</option>
            <option value="alphabets">Alphabets</option>
            <option value="highest_lowercase_alphabet">Highest Lowercase Alphabet</option>
          </select>
          <div>
            {selectedFields.includes('numbers') && response.numbers && (
              <div>
                <h3>Numbers</h3>
                <pre>{JSON.stringify(response.numbers, null, 2)}</pre>
              </div>
            )}
            {selectedFields.includes('alphabets') && response.alphabets && (
              <div>
                <h3>Alphabets</h3>
                <pre>{JSON.stringify(response.alphabets, null, 2)}</pre>
              </div>
            )}
            {selectedFields.includes('highest_lowercase_alphabet') && response.highest_lowercase_alphabet && (
              <div>
                <h3>Highest Lowercase Alphabet</h3>
                <pre>{JSON.stringify(response.highest_lowercase_alphabet, null, 2)}</pre>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
