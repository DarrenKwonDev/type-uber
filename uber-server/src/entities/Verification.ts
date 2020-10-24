import { verificationTarget } from "src/types/types";
import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

const PHONE = "PHONE";
const EMAIL = "EMAIL";

@Entity()
class Verification extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text", enum: [PHONE, EMAIL] })
  target: verificationTarget;

  @Column({ type: "text" })
  paylaod: string;

  @Column({ type: "text" })
  key: string;

  @Column({ type: "boolean", default: false })
  used: boolean;

  @CreateDateColumn() createdAt: string;
  @UpdateDateColumn() updatedAt: string;

  @BeforeInsert()
  createKey(): void {
    if (this.target === PHONE) {
      // 핸드폰일 경우 랜덤한 6자리 짧은 코드를 보냄
      this.key = Math.floor(Math.random() * 1000000).toString();
    } else if (this.target === EMAIL) {
      // Email일 경우 36진법으로 변환한 값을 보냄
      this.key = Math.random().toString(36).substr(2);
    }
  }
}

export default Verification;
