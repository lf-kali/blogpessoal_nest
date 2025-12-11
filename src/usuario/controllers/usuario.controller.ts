import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { UsuarioService } from "../services/usuario.service";
import { Usuario } from "../entities/usuario.entity";

@Controller('/usuarios')
export class UsuarioController {

    constructor(
        private readonly usuarioService: UsuarioService
    ) {}

    @Get('/all')
    @HttpCode(HttpStatus.OK)
    findAll(): Promise<Usuario[]> {
        return this.usuarioService.findAll();
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK)
    findByID(@Param('id', ParseIntPipe) id: number) {
        return this.usuarioService.findByID(id);
    }

    @Post('/cadastrar')
    @HttpCode(HttpStatus.CREATED)
    create(@Body() usuario: Usuario): Promise<Usuario> {
        return this.usuarioService.create(usuario);
    }

    @Put('/atualizar')
    @HttpCode(HttpStatus.OK)
    update(@Body() usuario: Usuario): Promise<Usuario> {
        return this.usuarioService.update(usuario);
    }
    
}