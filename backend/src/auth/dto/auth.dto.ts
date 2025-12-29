import { IsString, IsNotEmpty, Length, Matches, IsEmail, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
    // კომპანიის იურიდიული მონაცემები
    @IsString()
    @IsNotEmpty({ message: 'საიდენტიფიკაციო კოდი აუცილებელია' })
    @Length(9, 9, { message: 'საიდენტიფიკაციო კოდი უნდა იყოს 9 ციფრი' })
    @Matches(/^\d{9}$/, { message: 'საიდენტიფიკაციო კოდი უნდა შეიცავდეს მხოლოდ ციფრებს' })
    taxId: string;

    @IsString()
    @IsNotEmpty({ message: 'კომპანიის დასახელება აუცილებელია' })
    companyName: string;

    @IsString()
    @IsOptional()
    legalAddress?: string;

    // ავტორიზებული პირის მონაცემები
    @IsString()
    @IsNotEmpty({ message: 'სახელი და გვარი აუცილებელია' })
    authorizedPersonName: string;

    @IsEmail({}, { message: 'გთხოვთ შეიყვანოთ სწორი ელ-ფოსტა' })
    @IsNotEmpty({ message: 'ელ-ფოსტა აუცილებელია' })
    email: string;

    @IsString()
    @IsNotEmpty({ message: 'მობილურის ნომერი აუცილებელია' })
    @Matches(/^5\d{8}$/, { message: 'მობილურის ნომერი უნდა იყოს ფორმატში: 5XXXXXXXX (9 ციფრი)' })
    phoneNumber: string;

    // უსაფრთხოება
    @IsString()
    @IsNotEmpty({ message: 'პაროლი აუცილებელია' })
    @MinLength(8, { message: 'პაროლი უნდა შედგებოდეს მინიმუმ 8 სიმბოლოსგან' })
    password: string;
}

export class LoginDto {
    @IsString()
    @IsNotEmpty({ message: 'საიდენტიფიკაციო კოდი აუცილებელია' })
    taxId: string;

    @IsString()
    @IsNotEmpty({ message: 'პაროლი აუცილებელია' })
    password: string;
}
