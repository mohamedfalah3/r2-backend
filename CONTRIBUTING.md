# Contributing to R2 Backend

Thank you for your interest in contributing to the R2 Backend project! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### 1. Fork the Repository

1. Go to the [main repository](https://github.com/mohamedfalah3/r2-backend)
2. Click the "Fork" button in the top right
3. Clone your forked repository locally

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### 3. Make Your Changes

- Follow the coding standards below
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add new feature description"
```

### 5. Push and Create a Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## 📋 Pull Request Guidelines

### Before Submitting

- [ ] Code follows the style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] No console.log statements in production code
- [ ] Environment variables are properly handled
- [ ] Security considerations are addressed

### Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Security enhancement

## Testing
- [ ] Local testing completed
- [ ] Unit tests added/updated
- [ ] Integration tests pass

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)

## Screenshots (if applicable)
```

## 🎨 Coding Standards

### JavaScript/Node.js

- Use **ES6+** features
- Prefer `const` and `let` over `var`
- Use arrow functions where appropriate
- Use template literals for string interpolation
- Use async/await over Promises when possible

### Code Style

```javascript
// Good
const getSignedUrl = async (file) => {
  try {
    const response = await fetch(`/api/files/${file}`);
    return response.json();
  } catch (error) {
    console.error('Error fetching signed URL:', error);
    throw error;
  }
};

// Bad
function getSignedUrl(file) {
  return fetch('/api/files/' + file)
    .then(function(response) {
      return response.json();
    })
    .catch(function(error) {
      console.error('Error fetching signed URL:', error);
      throw error;
    });
}
```

### File Naming

- Use **kebab-case** for file names: `auth-service.js`
- Use **PascalCase** for classes: `CacheService`
- Use **camelCase** for functions and variables: `getSignedUrl`

### Error Handling

```javascript
// Good
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.error('Operation failed:', error);
  throw new Error('User-friendly error message');
}

// Bad
const result = await riskyOperation(); // No error handling
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Writing Tests

```javascript
// Example test structure
describe('CacheService', () => {
  describe('get', () => {
    it('should return cached value when key exists', async () => {
      // Arrange
      const cacheKey = 'test-key';
      const expectedValue = 'test-value';
      
      // Act
      const result = await CacheService.get(cacheKey);
      
      // Assert
      expect(result).toBe(expectedValue);
    });

    it('should return null when key does not exist', async () => {
      // Arrange
      const cacheKey = 'non-existent-key';
      
      // Act
      const result = await CacheService.get(cacheKey);
      
      // Assert
      expect(result).toBeNull();
    });
  });
});
```

## 📚 Documentation

### Code Comments

```javascript
/**
 * Generates a signed URL for file download
 * @param {string} file - The file path in the bucket
 * @param {string} [contentType] - Optional content type override
 * @returns {Promise<Object>} Signed URL response object
 * @throws {Error} When file parameter is invalid
 */
const generateSignedUrl = async (file, contentType) => {
  // Implementation
};
```

### README Updates

- Update README.md for new features
- Add examples for new endpoints
- Update deployment instructions if needed
- Keep the API documentation current

## 🔒 Security Guidelines

### Environment Variables

- Never commit sensitive data
- Use `.env` files for local development
- Document all required environment variables
- Use strong, unique values for production

### Input Validation

```javascript
// Good
const sanitizeFile = (file) => {
  if (typeof file !== 'string' || file.trim() === '') {
    throw new Error('Invalid file parameter');
  }
  return file.replace(/\.\./g, '').trim();
};

// Bad
const processFile = (file) => {
  return file; // No validation
};
```

### Rate Limiting

- Implement rate limiting for all public endpoints
- Use appropriate limits for different operations
- Monitor and log rate limit violations

## 🚀 Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Local Development

```bash
# Clone the repository
git clone https://github.com/mohamedfalah3/r2-backend.git
cd r2-backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env with your R2 credentials
# R2_ACCESS_KEY=your_key
# R2_SECRET_KEY=your_secret
# R2_ACCOUNT_ID=your_account_id
# R2_BUCKET=your_bucket

# Start development server
npm run dev
```

### Docker Development

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run with Redis (production profile)
docker-compose --profile production up --build
```

## 📊 Performance Guidelines

### Caching

- Use appropriate cache TTL values
- Implement cache invalidation strategies
- Monitor cache hit rates
- Use Redis for production caching

### Database/Storage

- Optimize R2 API calls
- Use batch operations when possible
- Implement proper error handling
- Monitor API usage and costs

## 🐛 Bug Reports

### Before Reporting

1. Check existing issues
2. Search for similar problems
3. Try to reproduce the issue
4. Check the troubleshooting guide

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2
3. Step 3

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Node.js version:
- npm version:
- Operating system:
- R2 configuration:

## Additional Information
Screenshots, logs, etc.
```

## 🎯 Feature Requests

### Before Requesting

1. Check if the feature already exists
2. Search for similar requests
3. Consider the impact on existing functionality
4. Think about implementation complexity

### Feature Request Template

```markdown
## Feature Description
Clear description of the requested feature

## Use Case
Why this feature is needed

## Proposed Implementation
How you think it should work

## Alternatives Considered
Other approaches you've considered

## Additional Information
Any other relevant details
```

## 📞 Getting Help

- **Issues**: Use GitHub Issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Documentation**: Check the README and DEPLOYMENT guides
- **Code Review**: Ask for help in Pull Request comments

## 🏆 Recognition

Contributors will be recognized in:
- GitHub contributors list
- README.md contributors section
- Release notes

Thank you for contributing to the R2 Backend project! 🚀
