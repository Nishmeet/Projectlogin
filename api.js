// Function to call the advice API and return the advice
export async function getAdvice() {
    try {
      const response = await fetch('https://api.adviceslip.com/advice');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.slip.advice; // Return the advice
    } catch (error) {
      console.error('Error fetching advice:', error);
      throw new Error('Error fetching advice: ' + error.message);
    }
  }
  