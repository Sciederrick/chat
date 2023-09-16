import json
import os
import random

# List of possible first names and last names for generating names
first_names = ["John", "Alice", "Michael", "Emily", "David", "Sophia", "Daniel", "Olivia", "William", "Emma"]
last_names = ["Smith", "Johnson", "Brown", "Davis", "Lee", "Wilson", "Hall", "Clark", "White", "Moore"]

# Initialize an empty list to store user profiles
user_profiles = []

# Generate 25 male and 25 female profiles
for _ in range(25):
    is_male = random.choice([True, False])
    first_name = random.choice(first_names)
    last_name = random.choice(last_names)
    
    # Generate a random email with the @example.com suffix
    email = f"{first_name.lower()}{last_name.lower()}@example.com"
    
    # Generate a random full name
    full_name = f"{first_name} {last_name}"
    
    # Generate other random fields
    avatar = None
    about = f"Passionate {random.choice(['ML Engineer', 'Data Scientist', 'Software Engineer'])} finding creative solutions."
    links = None
    
    # Construct the user profile object
    user_profile = {
        "email": email,
        "isMale": is_male,
        "avatar": avatar,
        "bio": {
            "fullName": full_name,
            "title": random.choice(["ML Engineer", "Data Scientist", "Software Engineer"]),
            "about": about,
            "links": links
        },
        "role": "client",
        "password": "12345678"
    }
    
    # Append the user profile to the list
    user_profiles.append(user_profile)

# Shuffle the list to randomize the order
random.shuffle(user_profiles)

# Print the first 5 profiles as an example
for profile in user_profiles[:5]:
    print(profile)

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Specify the output file path
output_file = os.path.join(script_dir, "user_profiles.json")

# Dump the user profiles to a JSON file
with open(output_file, "w") as json_file:
    json.dump(user_profiles, json_file, indent=4)

print(f"User profiles saved to {output_file}")