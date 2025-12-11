import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Usuario } from "../entities/usuario.entity";
import { Repository } from "typeorm";
import { Bcrypt } from "../../auth/bcrypt/bcrypt";

@Injectable()
export class UsuarioService {
    constructor (
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
        private bcrypt: Bcrypt
    ) {}

    async findAll(): Promise<Usuario[]> {
        return await this.usuarioRepository.find({
            relations: {
                postagem: true,
            },
        });

    }
    
    async findByID(id: number): Promise<Usuario> {

        const buscaUsuario = await this.usuarioRepository.findOne({
            where: {
                id,
            },
            relations: {
                postagem: true,
            },
        });

        if(!buscaUsuario) {
            throw new HttpException(`Não há um usuário com o id ${id}`, HttpStatus.NOT_FOUND);
        }

        return buscaUsuario;

    }

    async findByUsuario(usuario: string): Promise<Usuario | null> {
        return await this.usuarioRepository.findOne({
            where: {
                usuario: usuario,
            },
            relations: {
                postagem: true
            }
        });
    }

    async create(usuario: Usuario): Promise<Usuario> {
        const buscaUsuario = await this.findByUsuario(usuario.usuario);
        
        if (buscaUsuario) {
            throw new HttpException(`Usuário ${usuario} já existe!`, HttpStatus.BAD_REQUEST)
        }

        usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha);
        return await this.usuarioRepository.save(usuario);
    }

    async update(usuario: Usuario): Promise<Usuario> {

        await this.findByID(usuario.id);

        const buscaUsuario = await this.findByUsuario(usuario.usuario);

        if (buscaUsuario && buscaUsuario.id !== usuario.id) {
            throw new HttpException(`Usuário com email "${usuario.usuario} já existe!"`, HttpStatus.BAD_REQUEST);
        }

        usuario.senha = await this.bcrypt.criptografarSenha(usuario.senha)

        return await this.usuarioRepository.save(usuario);

    }
    
}