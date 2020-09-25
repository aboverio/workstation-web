import { ICustomValidator } from '@/types';

export default class CustomValidator implements ICustomValidator {
  public static firstName(input: string): string | null {
    if (!input) {
      return 'First Name cannot be empty!';
    }

    return null;
  }

  public static username(input: string): string | null {
    if (!input) {
      return 'Username cannot be empty!';
    } else if (!(input && input.length >= 6)) {
      return 'Username must be at least 6 characters!';
    } else if (input && /.+@.+\..+/.test(input)) {
      return 'Username cannot be an email format!';
    }

    return null;
  }

  public static email(input: string): string | null {
    if (!input) {
      return 'Email cannot be empty!';
    } else if (input && !/.+@.+\..+/.test(input)) {
      return 'Invalid email address!';
    }

    return null;
  }

  public static userIdentifier(input: string): string | null {
    if (!input) {
      return 'Username or email is required!';
    } else if (
      !input.includes('@') &&
      !(input && !/.+@.+\..+/.test(input) && input.length >= 6)
    ) {
      return 'Username must be at least 6 characters!';
    } else if (input.includes('@') && !(input && /.+@.+\..+/.test(input))) {
      return 'Invalid email address!';
    }

    return null;
  }

  public static password(input: string): string | null {
    if (!input) {
      return 'Password is required!';
    } else if (input.length < 6) {
      return 'Password must be at least 6 characters!';
    } else if (
      input.length >= 6 &&
      !/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*)(+=._-`])([a-zA-Z0-9!@#$%^&*)(+=._-`]+)$/g.test(
        input,
      )
    ) {
      return 'Password must contain at least a Number, a Special Character, and an Upper-Case Letter!';
    }

    return null;
  }

  public static confirmPassword(password: string, confirmTarget: string): string | null {
    if (password !== confirmTarget || !password || !confirmTarget) {
      return 'Password does not match!';
    }

    return null;
  }

  public static todoName(input: string): string | null {
    if (!input) {
      return 'Todo Name cannot be empty!';
    }

    return null;
  }
}
