import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ILike, Repository } from "typeorm";
import { Tema } from "../entities/tema.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult } from "typeorm/browser";

@Injectable()
export class TemaService {
    constructor(
        @InjectRepository(Tema)
        private temaRepository: Repository<Tema>
    ) {}

    async findAll(): Promise<Tema[]> {
        return await this.temaRepository.find({
            relations: {
                postagem: true,
            },
        });
    }

    async findByID(id: number): Promise<Tema> {
        const tema = await this.temaRepository.findOne({
            where: {
                id,
            },
            relations: {
                postagem: true,
            }
        });

        if (!tema){
            throw new HttpException('Tema não encontrado!', HttpStatus.NOT_FOUND);
        }

        return tema;
    }

    async findAllByDescricao(descricao: string): Promise<Tema[]> {
        return await this.temaRepository.find({
            where: {
                descricao: ILike(`%${descricao}%`),
            },
            relations: {
                postagem: true,
            }
        });
    }

    async create(tema: Tema): Promise<Tema> {
        return await this.temaRepository.save(tema);
    }

    async update(tema: Tema): Promise<Tema> {
        await this.findByID(tema.id);

        return await this.temaRepository.save(tema);
    }

    async delete(id: number): Promise<DeleteResult> {
        await this.findByID(id);

        return await this.temaRepository.delete(id);
    }
}