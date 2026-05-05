import os
import subprocess

def get_all_untracked_and_modified_files():
    # We will first add all files to index, then get the list, then unstage them
    subprocess.run(["git", "add", "."])
    
    result = subprocess.run(["git", "diff", "--name-only", "--cached"], capture_output=True, text=True)
    files = result.stdout.strip().split("\n")
    files = [f for f in files if f]
    
    # Unstage them
    subprocess.run(["git", "reset"])
    
    return files

def main():
    files = get_all_untracked_and_modified_files()
    if not files:
        print("No files to commit.")
        return

    num_commits = 170
    
    print(f"Total files: {len(files)}")
    print(f"Commits to make: {num_commits}")
    
    # We want to distribute `files` evenly across `num_commits`
    # We create a list of lists representing files for each commit
    files_per_commit_list = [[] for _ in range(num_commits)]
    
    for i, file in enumerate(files):
        # Determine which commit this file should go into
        commit_idx = (i * num_commits) // len(files)
        files_per_commit_list[commit_idx].append(file)
        
    for i in range(num_commits):
        chunk = files_per_commit_list[i]
        
        if chunk:
            print(f"Commit {i+1}/{num_commits}: adding {len(chunk)} files")
            batch_size = 50
            for j in range(0, len(chunk), batch_size):
                batch = chunk[j:j+batch_size]
                subprocess.run(["git", "add"] + batch)
        else:
            print(f"Commit {i+1}/{num_commits}: empty commit")
            
        commit_msg = f"feat: project integration part {i+1} of {num_commits}"
        subprocess.run(["git", "commit", "--allow-empty", "-m", commit_msg])

    print("All commits generated successfully.")

if __name__ == "__main__":
    main()
