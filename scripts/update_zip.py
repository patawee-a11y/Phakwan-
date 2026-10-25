import os
import shutil
import zipfile

def package_project():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    output_zip = os.path.join(root_dir, 'public', 'phakwan-letter.zip')
    temp_zip = '/tmp/phakwan-letter.zip.tmp'
    
    exclude_dirs = {'node_modules', 'dist', '.git', '.aistudio', '__pycache__', '.vite'}
    exclude_files = {'phakwan-letter.zip'}

    os.makedirs(os.path.dirname(output_zip), exist_ok=True)
    if os.path.exists(temp_zip):
        os.remove(temp_zip)

    with zipfile.ZipFile(temp_zip, 'w', zipfile.ZIP_DEFLATED) as z:
        for foldername, subfolders, filenames in os.walk(root_dir):
            subfolders[:] = [d for d in subfolders if d not in exclude_dirs]
            for filename in filenames:
                if filename in exclude_files or filename.endswith('.tmp'):
                    continue
                full_path = os.path.join(foldername, filename)
                rel_path = os.path.relpath(full_path, root_dir)
                z.write(full_path, rel_path)

    shutil.move(temp_zip, output_zip)
    print(f"Updated {output_zip} successfully ({os.path.getsize(output_zip)} bytes)")

if __name__ == '__main__':
    package_project()
