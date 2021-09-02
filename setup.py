from setuptools import setup, find_packages

with open('requirements.txt') as f:
	install_requires = f.read().strip().split('\n')

# get version from __version__ variable in farben_quoting/__init__.py
from farben_quoting import __version__ as version

setup(
	name='farben_quoting',
	version=version,
	description='Farben Quoting Application',
	author='Rosco Solutions',
	author_email='support@rosco.solutions',
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
