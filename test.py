import random

def generate_times_table_question():
    num1 = random.randint(1, 12)
    num2 = random.randint(1, 12)
    question = f"What is {num1} x {num2}?"
    return question

# Example usage
print(generate_times_table_question())
